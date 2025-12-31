import { IGymRepository } from "../../domain/repositories/IGymRepository.js";

export class LogoutGymUseCase {
    constructor(private gymRepository: IGymRepository) { }

    async execute(): Promise<void> {
        // In a stateless JWT system, logout is handled by clearing cookies
        // No server-side state to clean up since we removed Redis
        // The actual cookie clearing happens in the controller
        return;
    }
}
