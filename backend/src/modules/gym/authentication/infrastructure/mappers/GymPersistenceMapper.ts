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
            doc.ownerName
        );
    }

    static toPersistence(gym: Gym) {
        return {
            ownerName: gym.ownerName,
            email: gym.email,
            passwordHash: gym.passwordHash
        };
    }
}
