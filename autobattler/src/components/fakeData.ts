import type { Monster } from '@/types/monster';

const fakeData = [
    { id: 0, name: 'Dragon', description: 'A fierce dragon', stats: {
        health: 100,
        defense: 50,
        strength: 75,
        intelligence: 30,
        speed: 20,
        magic: 60,
        stealth: 10,
        luck: 15,
        charm: 25
    }, ability: 'FIRE', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png' },
    { id: 1, name: 'Goblin', description: 'A sneaky goblin', stats: {
        health: 30,
        defense: 10,
        strength: 20,
        intelligence: 25,
        speed: 40,
        magic: 5,
        stealth: 50,
        luck: 15,
        charm: 10
    }, ability: 'STEALTH', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png' },
    { id: 2, name: 'Wizard', description: 'A wise wizard', stats: {
        health: 50,
        defense: 20,
        strength: 15,
        intelligence: 80,
        speed: 10,
        magic: 90,
        stealth: 5,
        luck: 20,
        charm: 30
    }, ability: 'MAGIC', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png' },
] as Monster[];

export default function getFakeData(n = 3): Monster[] {
    if (n <= 0) return [];
    if (n > fakeData.length) {
        let result = [];
        for (let i = 0; i < n; i++) {
            let datum = { ...fakeData[i % fakeData.length], id: i }
            result.push(datum);
        }
        return result;
    } else if (n === fakeData.length) {
        return fakeData.map((m, i) => ({ ...m, id: i }));
    } else {
        return fakeData.slice(0, n).map((m, i) => ({ ...m, id: i }));
    }
}
