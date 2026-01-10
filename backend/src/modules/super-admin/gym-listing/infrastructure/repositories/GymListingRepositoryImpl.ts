import { IGymListingRepository } from "../../domain/repositories/IGymListingRepository.js";
import { GymSummary, PaginatedGyms } from "../../domain/entities/GymSummary.js";
import { GymModel } from "../../../../gym/authentication/infrastructure/database/mongoose/GymSchema.js"; // Cross-module import unavoidable for shared DB

export class GymListingRepositoryImpl implements IGymListingRepository {
    async findAll(page: number, limit: number, search?: string): Promise<PaginatedGyms> {
        const query: any = {};

        if (search) {
            query.$or = [
                { gymName: { $regex: search, $options: 'i' } },
                { ownerName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { 'address.city': { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const [gyms, total] = await Promise.all([
            GymModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            GymModel.countDocuments(query)
        ]);

        const gymSummaries = gyms.map((doc: any) => new GymSummary(
            doc._id.toString(),
            doc.gymName || 'N/A',
            doc.ownerName || 'N/A',
            doc.email,
            doc.phone || 'N/A',
            doc.address?.city || 'N/A',
            doc.address?.state || 'N/A',
            doc.createdAt,
            doc.isBlocked
        ));

        return {
            gyms: gymSummaries,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    async findById(id: string): Promise<GymSummary | null> {
        const doc: any = await GymModel.findById(id);
        if (!doc) return null;
        return new GymSummary(
            doc._id.toString(),
            doc.gymName || 'N/A',
            doc.ownerName || 'N/A',
            doc.email,
            doc.phone || 'N/A',
            doc.address?.city || 'N/A',
            doc.address?.state || 'N/A',
            doc.createdAt,
            doc.isBlocked
        );
    }

    async block(id: string, isBlocked: boolean): Promise<void> {
        await GymModel.findByIdAndUpdate(id, { isBlocked });
    }

    async delete(id: string): Promise<void> {
        await GymModel.findByIdAndDelete(id);
    }
}
