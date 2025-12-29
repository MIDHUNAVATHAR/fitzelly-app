import { IGymRepository } from "../../../domain/repositories/IGymRepository.js";
import { Gym } from "../../../domain/entities/Gym.js";
import { GymModel } from "./GymSchema.js";
import { GymPersistenceMapper } from "../../mappers/GymPersistenceMapper.js";

export class MongooseGymRepository implements IGymRepository {
    async create(gym: Gym): Promise<Gym> {
        const persistenceData = GymPersistenceMapper.toPersistence(gym);
        const newGym = new GymModel(persistenceData);
        await newGym.save();
        return GymPersistenceMapper.toDomain(newGym);
    }

    async findByEmail(email: string): Promise<Gym | null> {
        const gymDoc = await GymModel.findOne({ email });
        if (!gymDoc) return null;
        return GymPersistenceMapper.toDomain(gymDoc);
    }

    async findById(id: string): Promise<Gym | null> {
        const gymDoc = await GymModel.findById(id);
        return gymDoc ? GymPersistenceMapper.toDomain(gymDoc) : null; 
    }
}
