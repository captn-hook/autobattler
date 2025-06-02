type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type Stats = {
    health: IntRange<1, 100>;
    defense: IntRange<1, 100>;
    strength: IntRange<1, 100>;
    intelligence: IntRange<1, 100>;
    speed: IntRange<1, 100>;
    magic: IntRange<1, 100>;
    stealth: IntRange<1, 100>;
    luck: IntRange<1, 100>;
    charm: IntRange<1, 100>;
}