import { LostAnimal } from '@domain/LostAnimal/LostAnimal';

export abstract class LostAnimalsRepository {
  abstract create(animal: LostAnimal): Promise<void>;
}
