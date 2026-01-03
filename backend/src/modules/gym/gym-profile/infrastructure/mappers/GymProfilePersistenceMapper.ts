import { GymProfile } from "../../domain/entities/GymProfile.js";
import { GymDocument } from "../../../authentication/infrastructure/database/mongoose/GymSchema.js"; // Reuse Schema

export class GymProfilePersistenceMapper {
    static toDomain(doc: GymDocument): GymProfile {
        return new GymProfile(
            doc._id.toString(),
            doc.email,
            doc.ownerName,
            doc.gymName,
            doc.phone,
            doc.description,
            doc.address ? {
                street: doc.address.street,
                city: doc.address.city,
                state: doc.address.state,
                pincode: doc.address.pincode,
                mapLink: doc.address.mapLink,
            } : undefined
        );
    }
}
