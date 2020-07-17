export class Alert {
    _id: string;
    x: number;
    y: number;
    type: string;
    speed: number;
    price: number;
    info: string;
    expected_delay: string;
    user_id: string;

    public constructor(x: number, y: number, type: string, speed: number,
    price: number,
    info: string,
    expected_delay: string,
    user_id: string) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.speed = speed;
        this.price = price;
        this.info = info;
        this.expected_delay = expected_delay;
        this.user_id = user_id;
    }
}