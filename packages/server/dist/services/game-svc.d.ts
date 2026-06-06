import { Game } from "../models/index.ts";
declare function index(filter?: Record<string, string>): Promise<Game[]>;
declare function get(id: string): Promise<Game | undefined>;
declare function create(json: Game): Promise<Game>;
declare function update(id: String, game: Game): Promise<Game | undefined>;
declare function remove(id: String): Promise<void>;
declare const _default: {
    index: typeof index;
    get: typeof get;
    create: typeof create;
    update: typeof update;
    remove: typeof remove;
};
export default _default;
