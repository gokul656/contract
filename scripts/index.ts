import * as borsh from "borsh";

class CreateTopic {
    title: string;
    options: string[];

    constructor(title: string, options: string[]) {
        this.title = title;
        this.options = options;
    }
}

class Assignable {
    constructor(properties) {
        Object.keys(properties).forEach((key) => {
            this[key] = properties[key];
        });
    }
}

class CreateTopicInstruction extends Assignable {
    toBuffer() {
        return Buffer.from(borsh.serialize({"struct": {"title": "string", "options": "string"}}, this));
    }
}

// Usage example
const createTopicInstruction = new CreateTopicInstruction({
    // properties of CreateTopicInstruction
});
const buffer = createTopicInstruction.toBuffer();

console.log(buffer)