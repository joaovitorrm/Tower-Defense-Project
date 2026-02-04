import type { Turret } from "./Turrets";

export default class Player {

    public placingTurret: Turret | null = null;

    constructor(private money: number, private lives: number) {}

    getMoney(): number {
        return this.money;
    }

    addMoney(amount: number): void {
        this.money += amount;
    }

    deductMoney(amount: number): boolean {
        if (this.money >= amount) {
            this.money -= amount;
            return true;
        }
        return false;
    }

    getLives(): number {
        return this.lives;
    }

    deductLife(): void {
        if (this.lives > 0) {
            this.lives -= 1;
        }
    }
}