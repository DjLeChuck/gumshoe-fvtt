// import { TrailActor } from "./module/TrailActor";
// type BaseAbilityData = {
//   "rating": number,
//   "pool": number,
//   "hasSpecialities": boolean,
//   "speciality": string
// }

// export type InvestigativeAbilityData = BaseAbilityData & {
//   "category": string,
// }

// export type GeneralAbilityData = BaseAbilityData & {
//   "canBeInvestigative": boolean,
// }

// export type InvestigativeAbility = Item<InvestigativeAbilityData>;

// export type GeneralAbility = Item<GeneralAbilityData>;

export type Resource = {
  min?: number,
  max: number,
  value: number,
}

export type PCTrailActorData = {
  buildPoints: number,
  health: number,
  stability: number,
  sanity: number,
  magic: number,
  drive: string,
  occupation: string,
  occupationalBenefits: string,
  pillarsOfSanity: string,
  sourcesOfStability: string,
  notes: string,
  background: string,
  initiativeAbility: string,
  resources: {
    health: Resource,
    sanity: Resource,
    stability: Resource,
    magic: Resource,
  },
};

export type EquipmentData = {
  notes: string,
}

export type WeaponData = {
  notes: string,
  ability: string,
  damage: number,
  pointBlankDamage: number,
  closeRangeDamage: number,
  nearRangeDamage: number,
  longRangeDamage: number,
  isPointBlank: boolean,
  isCloseRange: boolean,
  isNearRange: boolean,
  isLongRange: boolean,
}

export type CoreAbilityData = {
  rating: number,
  pool: number,
  min: number,
  max: number,
  occupational: boolean,
  hasSpecialities: boolean,
  specialities: string[],
}

export type InvestAbilityData = CoreAbilityData & {
  category: string,
}

export type GeneralAbilityData = CoreAbilityData & {
  canBeInvestigative: boolean,
}

export type AbilityData = InvestAbilityData | GeneralAbilityData;

// the most correct "type" for this is a Partial-wrapped splodge of all the
// possibilities. I don't like it.
export type TrailItemData = Partial<EquipmentData & WeaponData & InvestAbilityData & GeneralAbilityData>;
// export type TrailItemData = EquipmentData | WeaponData | AbilityData;

// export type PCTrailActor = TrailActor<PCTrailActorData>;

export type GetterDict<T> = {
  [P in keyof T]?: () => T[P];
}

export type SetterDict<T> = {
  [P in keyof T]?: (val: T[P]) => void;
}

/**
 * this is wild - extract a subset of prperties from a type based on a test
 * see https://stackoverflow.com/a/57386444/212676
 */
export type PickByType<T, P> = Omit<
  T,
  { [K in keyof T]: T[K] extends P ? never : K }[keyof T]
>;

/**
 * Like Partial<T>, but recursive.
 */
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
  ? RecursivePartial<U>[]
  : T[P] extends Record<string, unknown>
  ? RecursivePartial<T[P]>
  : T[P];
};
