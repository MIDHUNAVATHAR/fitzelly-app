import { GymEquipment } from "../../domain/entities/GymEquipment.js";
import { IGymEquipmentDocument } from "../database/mongoose/GymEquipmentSchema.js";

export class GymEquipmentPersistenceMapper {
    static toDomain(doc: IGymEquipmentDocument): GymEquipment {
        return new GymEquipment(
            doc._id.toString(),
            doc.gymId.toString(),
            doc.name,
            doc.photoUrl,
            doc.windowTime,
            doc.condition,
            doc.isDeleted
        );
    }

    static toPersistence(entity: GymEquipment): Partial<IGymEquipmentDocument> {
        return {
            name: entity.name,
            photoUrl: entity.photoUrl,
            windowTime: entity.windowTime,
            condition: entity.condition,
            isDeleted: entity.isDeleted
        };
    }
}
