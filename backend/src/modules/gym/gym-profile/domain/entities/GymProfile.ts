export class GymProfile {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public ownerName?: string,
        public gymName?: string,
        public phone?: string,
        public description?: string,
        public logoUrl?: string,
        public address?: {
            street?: string;
            city?: string;
            state?: string;
            pincode?: string;
            mapLink?: string;
        }
    ) { }

    updateDetails(props: {
        ownerName?: string;
        gymName?: string;
        phone?: string;
        description?: string;
        logoUrl?: string;
        address?: {
            street?: string;
            city?: string;
            state?: string;
            pincode?: string;
            mapLink?: string;
        };
    }): GymProfile {
        if (props.ownerName !== undefined) this.ownerName = props.ownerName;
        if (props.gymName !== undefined) this.gymName = props.gymName;
        if (props.phone !== undefined) this.phone = props.phone;
        if (props.description !== undefined) this.description = props.description;
        if (props.logoUrl !== undefined) this.logoUrl = props.logoUrl;

        if (props.address) {
            this.address = {
                ...this.address,
                ...props.address
            };
        }

        return this;
    }
}
