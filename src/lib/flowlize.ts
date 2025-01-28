import { isImageUrl } from "./utils";

//@typescript-eslint/no-explicit-any
interface FlowSchema {
    nodes: object[],
    edges: object[]
}

let nodeId = 1;

export const flowlize = async (raw_json: object): Promise<FlowSchema> => {
    const nodes: any[] = [];
    const edges: any[] = [];
    raw_json = { root: raw_json }
    const processObject = async (obj: any, label: string, parentId: string | null = null, type = "object", nodeType = "smoothstep") => {
        const currentId = (nodeId++).toString();
        const nodeData: any = { label, type, data: {} };
        const currentNode = {
            id: currentId,
            type: "custom",
            data: nodeData,
            position: { x: 0, y: 0 },
        };
        nodes.push(currentNode);
        if (parentId) {
            edges.push({
                id: `e${parentId}-${currentId}`,
                source: parentId,
                target: currentId,
                type: nodeType,
                style: { strokeWidth: nodeType === "default" ? 2 : 1 },
            });
        }
        for (const [key, value] of Object.entries(obj)) {
            let type = "object"
            if (
                value === null ||
                value === undefined ||
                typeof value === "string" ||
                typeof value === "number" ||
                typeof value === "boolean"
            ) {
                nodeData["data"][key] = value;
                // If image
                if (typeof value === "string" && value.startsWith("https://")) {
                    if (await isImageUrl(value)) {
                        const id = currentId + Math.random()
                        const nodeData: any = { label: key, type: "image", data: { src: value } };

                        const currentNode = {
                            id: id,
                            type: "custom",
                            data: nodeData,
                            position: { x: 0, y: 0 },
                        };
                        nodes.push(currentNode);
                        if (parentId) {
                            edges.push({
                                id: `e${currentId}-${id}`,
                                source: currentId,
                                target: id,
                                type: nodeType,
                                style: { strokeWidth: nodeType === "default" ? 2 : 1 },
                            });
                        }
                    }
                }
            } else if (Array.isArray(value)) {
                nodeData["data"][key] = [`Array [${value.length} items]`];
                type = "array"
                await processObject(value, key, currentId, type);
                // for (const [index, item] of value.entries()) {
                //     processObject({ [index]: item }, `${key} [${index}]`, currentId, type, nodeType = "default");
                // }
            } else if (typeof value === "object") {
                nodeData["data"][key] = { value: `Object (${Object.keys(value).length} keys)` };
                type = "object"
                await processObject(value, key, currentId, type);
            }
        }
    };

    for (const [key, value] of Object.entries(raw_json)) {
        await processObject(value, key);
    }
    return { nodes, edges };
};
