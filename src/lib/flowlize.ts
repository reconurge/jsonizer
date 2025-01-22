//@typescript-eslint/no-explicit-any
interface FlowSchema {
    nodes: object[],
    edges: object[]
}

let nodeId = 1;

export const flowlize = (raw_json: object): FlowSchema => {
    const nodes: any[] = [];
    const edges: any[] = [];
    raw_json = { data: raw_json }

    const processObject = (obj: any, label: string, parentId: string | null = null, type = "object") => {
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
                type: 'smoothstep',
            });
        }

        for (const [key, value] of Object.entries(obj)) {
            let type = "object"
            if (
                value === null ||
                value === undefined ||
                typeof value === "string" ||
                typeof value === "number"
            ) {
                nodeData["data"][key] = value;
            } else if (Array.isArray(value)) {
                nodeData["data"][key] = `Array [${value.length} items]`;
                type = "array"
            } else if (typeof value === "object") {
                nodeData["data"][key] = `Object (${Object.keys(value).length} keys)`;
                type = "object"
                processObject(value, key, currentId, type);
            }
        }
    };

    for (const [key, value] of Object.entries(raw_json)) {
        processObject(value, key);
    }
    return { nodes, edges };
};
