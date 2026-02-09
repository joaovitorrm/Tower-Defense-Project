type EventHandler<T = any> = (payload: T) => void;

export class EventBus<Events extends Record<string, any>> {
  private events: {
    [K in keyof Events]?: EventHandler<Events[K]>[];
  } = {};

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event]!.push(handler);
  }

  off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>) {
    this.events[event] =
      this.events[event]?.filter(h => h !== handler);
  }

  once<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>) {
    const wrapper: EventHandler<Events[K]> = (payload) => {
      handler(payload);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  emit<K extends keyof Events>(event: K, payload?: Events[K]) {
    this.events[event]?.forEach(handler => handler(payload ? payload : undefined as Events[K]));
  }

  clear(event?: keyof Events) {
    if (event) delete this.events[event];
    else this.events = {};
  }
}

export const EventBusInstance = new EventBus();
