import Animality from 'animality';
interface AnimalObject {
    type: string;
    animal: string;
    image: string;
    fact: string;
    image_id: string;
    fact_id: string;
}

export class AnimalityFunctions {
    public async get(type?: string | string[]): Promise<AnimalObject | AnimalObject[]> {
        return await Animality.getAsync(type);
    }
}