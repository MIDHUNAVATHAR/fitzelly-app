import { Gym } from "../../domain/entities/Gym.js";
import { GymDocument } from "../database/mongoose/GymSchema.js";

export class GymPersistenceMapper {
    static toDomain(doc: GymDocument): Gym {
        return new Gym(
            doc._id.toString(),
            doc.email,
            doc.passwordHash,
            doc.createdAt,
            doc.updatedAt,
            doc.ownerName,
            doc.gymName,
            doc.phone,
            doc.description,
            doc.address ? {
                street: doc.address.street,
                city: doc.address.city,
                state: doc.address.state,
                pincode: doc.address.pincode,
                mapLink: doc.address.mapLink
            } : undefined,
            doc.logoUrl,
            doc.isBlocked
        );
    }

    static toPersistence(gym: Gym) {
        return {
            ownerName: gym.ownerName,
            gymName: gym.gymName,
            phone: gym.phone,
            description: gym.description,
            logoUrl: gym.logoUrl,
            isBlocked: gym.isBlocked,
            address: gym.address ? {
                street: gym.address.street,
                city: gym.address.city,
                state: gym.address.state,
                pincode: gym.address.pincode,
                mapLink: gym.address.mapLink
            } : undefined,
            email: gym.email,
            passwordHash: gym.passwordHash
        };
    }
}
