import { faker } from "@faker-js/faker";
import Task from "../models/Task.js";

export class SeedPromise {
  constructor(userId, category) {
    this.userId = userId;
    this.category = category;
    this.dateNow = new Date();
  }

  addPromise = (quantity) => {
    return Array(quantity)
      .fill(null)
      .map(() => {
        const taskData = {
          task: `${faker.word.adjective()} ${faker.word.noun()} ${faker.word.preposition()} ${faker.word.verb()}`,
          priority: faker.datatype.number({ min: 1, max: 4 }),
          owner: this.userId,
          completed: faker.datatype.boolean(),
          date: faker.datatype.datetime({
            min: this.dateNow.getTime(),
            max: this.dateNow.setDate(this.dateNow.getDate() + 1),
          }),
          category: this.category,
        };
        console.log(
          `Task ${taskData.task} with category ${taskData.category} has been created`
        );

        const task = new Task(taskData);

        return task.save();
      });
  };
}
