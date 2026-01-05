export class GymEquipment {
    constructor(
        public readonly id: string,
        public readonly gymId: string,
        public readonly name: string,
        public readonly photoUrl: string,
        public readonly windowTime: number,
        public readonly condition: 'good' | 'bad',
        public readonly isDeleted: boolean
    ) { }

    update(props: Partial<Omit<GymEquipment, 'id' | 'gymId' | 'isDeleted'>>): GymEquipment {
        return new GymEquipment(
            this.id,
            this.gymId,
            props.name ?? this.name,
            props.photoUrl ?? this.photoUrl,
            props.windowTime ?? this.windowTime,
            props.condition ?? this.condition,
            this.isDeleted
        );
    }

    markAsDeleted(): GymEquipment {
        return new GymEquipment(
            this.id,
            this.gymId,
            this.name,
            this.photoUrl,
            this.windowTime,
            this.condition,
            true
        );
    }
}
