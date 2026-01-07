import { IGymRepository } from "../../domain/repositories/IGymRepository.js";
import { Gym } from "../../domain/entities/Gym.js";

export interface UpdateGymProfileDTO {
    userId: string;
    ownerName?: string;
    gymName?: string;
    phone?: string;
    description?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
        mapLink?: string;
    };
}

export class UpdateGymProfileUseCase {
    constructor(private gymRepository: IGymRepository) { }

    async execute(request: UpdateGymProfileDTO): Promise<Gym> {
        const gym = await this.gymRepository.findById(request.userId);
        if (!gym) throw new Error("Gym account not found");

        const updatedGym = new Gym(
            gym.id,
            gym.email,
            gym.passwordHash,
            gym.createdAt,
            new Date(),
            request.ownerName ?? gym.ownerName,
            request.gymName ?? gym.gymName,
            request.phone ?? gym.phone,
            request.description ?? gym.description,
            {
                street: request.address?.street ?? gym.address?.street ?? "",
                city: request.address?.city ?? gym.address?.city ?? "",
                state: request.address?.state ?? gym.address?.state ?? "",
                pincode: request.address?.pincode ?? gym.address?.pincode ?? "",
                mapLink: request.address?.mapLink ?? gym.address?.mapLink ?? ""
            }
        );

        return await this.gymRepository.update(updatedGym);
    }
}
