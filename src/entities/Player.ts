import { EventBusInstance } from "../core/EventBus";
import type { Turret } from "./Turrets";

export default class Player {

    public placingTurret: Turret | null = null;

    constructor(private money: number, private lives: number) {
        EventBusInstance.on('enemyKilled', ({ enemy }) => {
            this.addMoney(enemy.bounty);
        });
    }

    getMoney(): number {
        return this.money;
    }

    addMoney(amount: number): void {
        this.money += amount;
        EventBusInstance.emit('moneyChanged');
    }

    deductMoney(amount: number): boolean {        
        if (this.money >= amount) {
            this.money -= amount;
            EventBusInstance.emit('moneyChanged');
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
            EventBusInstance.emit('lifeChanged');
        }
    }
}