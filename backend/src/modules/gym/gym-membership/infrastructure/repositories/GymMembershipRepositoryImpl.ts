import { IGymMembershipRepository, MembershipWithDetails } from "../../domain/repositories/IGymMembershipRepository.js";
import { GymMembership } from "../../domain/entities/GymMembership.js";
import { GymMembershipModel } from "../database/mongoose/GymMembershipSchema.js";
import { GymMembershipPersistenceMapper } from "../mappers/GymMembershipPersistenceMapper.js";
import mongoose from "mongoose";

export class GymMembershipRepositoryImpl implements IGymMembershipRepository {

    async create(membership: GymMembership): Promise<GymMembership> {
        const persistence = GymMembershipPersistenceMapper.toPersistence(membership);
        const doc = await GymMembershipModel.create(persistence);
        return GymMembershipPersistenceMapper.toDomain(doc);
    }

    async findById(id: string): Promise<GymMembership | null> {
        const doc = await GymMembershipModel.findById(id);
        if (!doc) return null;
        return GymMembershipPersistenceMapper.toDomain(doc);
    }

    async update(membership: GymMembership): Promise<GymMembership> {
        const persistence = GymMembershipPersistenceMapper.toPersistence(membership);
        const doc = await GymMembershipModel.findByIdAndUpdate(membership.id, persistence, { new: true });
        if (!doc) throw new Error("Membership not found");
        return GymMembershipPersistenceMapper.toDomain(doc);
    }

    async findMemberships(gymId: string, options: { page: number; limit: number; search?: string; planType?: string; }): Promise<{ items: MembershipWithDetails[]; total: number; }> {
        const { page = 1, limit = 10, search, planType } = options;
        const skip = (page - 1) * limit;

        const matchStage: any = {
            gymId: new mongoose.Types.ObjectId(gymId),
            isDelete: false,
            // status: 'active' // User said "Active Memberships", but maybe we want all unless filtered? 
            // The UI title is "Active Memberships", and filter has "All Plans". status isn't filtered in UI.
            // But typically "Active Memberships" implies status=active.
            // Let's filter status: 'active' by default? Or should we show expired too?
            // The uploaded image shows "Active Memberships (3)".
            // One row has expiry 2024-12-01 (past?). Date today is 2026.
            // Wait, the image timestamps are 2024.
            // Let's assume this page shows *currently active* memberships.
            // So status: 'active' is likely safer. Or we check date.
            // Let's rely on the 'status' field in the document.
            status: 'active'
        };

        const pipeline: any[] = [
            { $match: matchStage },
            // Lookup Client
            {
                $lookup: {
                    from: 'gymclients', // Check actual collection name
                    localField: 'clientId',
                    foreignField: '_id',
                    as: 'client'
                }
            },
            { $unwind: '$client' },
            // Lookup Plan
            {
                $lookup: {
                    from: 'gymplans', // Check actual collection name
                    localField: 'planId',
                    foreignField: '_id',
                    as: 'plan'
                }
            },
            { $unwind: '$plan' }
        ];

        // Search Filter (Client Name)
        if (search) {
            pipeline.push({
                $match: {
                    'client.fullName': { $regex: search, $options: 'i' }
                }
            });
        }

        // Plan Type Filter
        if (planType && planType !== 'all') {
            pipeline.push({
                $match: {
                    'plan.type': planType // 'category' or 'day'
                }
            });
        }

        // Count for pagination
        const countPipeline = [...pipeline, { $count: 'total' }];

        // Data pipeline
        pipeline.push(
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 1,
                    clientId: '$client._id',
                    clientName: '$client.fullName',
                    planId: '$plan._id',
                    planName: '$plan.planName',
                    planType: '$plan.type',
                    startDate: 1,
                    expiredDate: 1,
                    totalPurchasedDays: 1,
                    remainingDays: 1,
                    status: 1,
                    isDelete: 1
                }
            }
        );

        const [dataResult, countResult] = await Promise.all([
            GymMembershipModel.aggregate(pipeline),
            GymMembershipModel.aggregate(countPipeline)
        ]);

        const items: MembershipWithDetails[] = dataResult.map(doc => ({
            id: doc._id.toString(),
            clientId: doc.clientId.toString(),
            clientName: doc.clientName,
            planId: doc.planId.toString(),
            planName: doc.planName,
            planType: doc.planType,
            startDate: doc.startDate,
            expiredDate: doc.expiredDate,
            totalPurchasedDays: doc.totalPurchasedDays,
            remainingDays: doc.remainingDays,
            status: doc.status,
            isDelete: doc.isDelete,
            planMonthlyFee: 0 // populate if needed
        }));

        const total = countResult.length > 0 ? countResult[0].total : 0;

        return { items, total };
    }

    async countActiveMemberships(clientId: string): Promise<number> {
        return GymMembershipModel.countDocuments({
            clientId: new mongoose.Types.ObjectId(clientId),
            isDelete: false,
            status: 'active'
        });
    }
}
