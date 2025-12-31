import { Gym } from "../../domain/entities/Gym.js";
import { GymDocument } from "../database/mongoose/GymSchema.js";

export class GymPersistenceMapper {
    static toDomain(doc: GymDocument): Gym {
        return new Gym(
            doc._id.toString(),
            doc.name,
            doc.email,
            doc.passwordHash,
            doc.createdAt,
            doc.updatedAt
        );
    }

    static toPersistence(gym: Gym) {
        return {
            name: gym.name,
            email: gym.email,
            passwordHash: gym.passwordHash
        };
    }
}
