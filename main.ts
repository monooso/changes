import { parse } from "jsr:@std/csv";
import { TodoistApi } from "@doist/todoist-api-typescript";

type Task = {
  title: String;
  description: String;
};

/**
 * Create an instance of the Todoist client.
 */
function createTodoistClient(): TodoistApi {
  const key = Deno.env.get("TODOIST_API_KEY");
  return new TodoistApi(key);
}

/**
 * Converts the given CSV string into an array of tasks.
 */
function parseCsvString(data: string): Array<Task> {
  return parse(data, { skipFirstRow: true, strip: true });
}

/**
 * Asynchronously reads the contents of the specified file.
 */
async function readCsvFile(filename: string): Promise<string> {
  return Deno.readTextFile(filename);
}

/**
 * Selects a random task from the given array of tasks.
 */
function selectRandomTask(tasks: Array<Task>): Task {
  const index = Math.floor(Math.random() * tasks.length);
  return tasks[index];
}

/**
 * Run all the things.
 */
async function main() {
  // Select the daily task.
  const data = await readCsvFile("data/small_changes.csv");
  const tasks = parseCsvString(data);
  const dailyTask = selectRandomTask(tasks);

  // Create the Todoist task.
  const client = createTodoistClient();

  await client.addTask({
    content: dailyTask.title,
    description: dailyTask.description,
    dueString: "Today",
    priority: 2
  });
}

main();
