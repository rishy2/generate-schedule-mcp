"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const generateSchedulesTool = {
    name: "generate_schedules_from_classes",
    description: "Given a 2D list of classes, generates all possible schedules",
    inputSchema: {
        type: "object",
        properties: {
            courses: {
                type: "array",
                items: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            crn: { type: "string" },
                            school: { type: "string" },
                            term: { type: "string" },
                            subject: { type: "string" },
                            coursenumber: { type: "string" },
                            maximumenrollment: { type: "number" },
                            enrollment: { type: "number" },
                            seatsavailable: { type: "number" },
                            waitcount: { type: "number" },
                            credithourlow: { type: "number" },
                            coursetitle: { type: "string" },
                            subjectdescription: { type: "string" },
                            timesasnumber: { type: "array", items: { type: "number" } },
                            meetingtimes: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        monday: { type: "boolean" },
                                        tuesday: { type: "boolean" },
                                        wednesday: { type: "boolean" },
                                        thursday: { type: "boolean" },
                                        friday: { type: "boolean" },
                                        startDate: { type: "string" },
                                        endDate: { type: "string" },
                                        startTime: { type: "number" },
                                        endTime: { type: "number" },
                                        building: { type: "string" },
                                        campus: { type: "string" },
                                        room: { type: "string" }
                                    },
                                    required: [
                                        "monday", "tuesday", "wednesday", "thursday", "friday",
                                        "startDate", "endDate", "startTime", "endTime",
                                        "building", "campus", "room"
                                    ]
                                }
                            },
                            teachers: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "number" },
                                        email_id: { type: "string" },
                                        full_name: { type: "string" },
                                        first_name: { type: "string" },
                                        last_name: { type: "string" },
                                        rating: { type: "number" },
                                        school: { type: "string" },
                                        numreviews: { type: "number" }
                                    },
                                    required: [
                                        "id", "email_id", "full_name", "first_name",
                                        "last_name", "rating", "school", "numreviews"
                                    ]
                                }
                            }
                        },
                        required: [
                            "id", "crn", "school", "term", "subject", "coursenumber",
                            "maximumenrollment", "enrollment", "seatsavailable", "waitcount",
                            "credithourlow", "coursetitle", "subjectdescription", "meetingtimes", "timesasnumber"
                        ]
                    }
                }
            }
        },
        required: ["courses"]
    }
};
async function getSchedules(courses) {
    const response = await fetch("https://api.schedulehero.org/getValidSchedules", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ courses: courses, busy: [] }),
    });
    if (!response.ok) {
        throw new Error("Failed to fetch schedules");
    }
    const data = await response.json();
    return data;
}
async function main() {
    const server = new index_js_1.Server({
        name: "Slack MCP Server",
        version: "1.0.0",
    }, {
        capabilities: {
            tools: {},
        },
    });
    server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
        console.error("Received CallToolRequest:", request);
        try {
            if (!request.params.arguments) {
                throw new Error("No arguments provided");
            }
            switch (request.params.name) {
                case "generate_schedules_from_classes": {
                    const args = request.params.arguments;
                    const response = await getSchedules(args.courses);
                    return {
                        toolResult: response
                    };
                }
                default: throw new Error(`Unknown tool: ${request.params.name}`);
            }
        }
        catch (error) {
            console.error("Error executing tool:", error);
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : String(error),
                        }),
                    },
                ],
            };
        }
    });
    server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
        console.error("Received ListToolsRequest");
        return {
            tools: [
                generateSchedulesTool
            ],
        };
    });
    const transport = new stdio_js_1.StdioServerTransport();
    console.error("Connecting server to transport...");
    await server.connect(transport);
    console.error("Slack MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
