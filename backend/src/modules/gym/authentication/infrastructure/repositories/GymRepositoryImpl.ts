import { IGymRepository } from "../../domain/repositories/IGymRepository.js";
import { Gym } from "../../domain/entities/Gym.js";
import { GymModel } from "../database/mongoose/GymSchema.js";
import { GymPersistenceMapper } from "../mappers/GymPersistenceMapper.js";

export class GymRepositoryImpl implements IGymRepository {
    async create(gym: Gym): Promise<Gym> {
        const persistenceData = GymPersistenceMapper.toPersistence(gym); //application to database ... filter the data for db
        const newGym = new GymModel(persistenceData);
        await newGym.save();
        return GymPersistenceMapper.toDomain(newGym);  //db to application 
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

    async update(gym: Gym): Promise<Gym> {
        const persistenceData = GymPersistenceMapper.toPersistence(gym);
        const updatedGym = await GymModel.findByIdAndUpdate(
            gym.id,
            persistenceData,
            { new: true }
        );

        if (!updatedGym) {
            throw new Error("Gym not found for update");
        }

        return GymPersistenceMapper.toDomain(updatedGym);
    }
}
