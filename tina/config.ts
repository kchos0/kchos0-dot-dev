import { defineConfig } from "tinacms";

export default defineConfig({
    branch: "main",
    clientId: null,
    token: null,
    build: {
        outputFolder: "admin",
        publicFolder: ".",
    },
    media: {
        tina: {
            mediaRoot: "media",
            publicFolder: ".",
        },
    },
    schema: {
        collections: [
            {
                name: "post",
                label: "Posts",
                path: "content",
                fields: [
                    {
                        type: "string",
                        name: "title",
                        label: "Title",
                        isTitle: true,
                        required: true,
                    },
                    {
                        type: "datetime",
                        name: "date",
                        label: "Date",
                        required: true,
                        ui: {
                            // Automatically provide human-readable date e.g February 25, 2026
                            defaultValue: (() => {
                                const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                                return formatter.format(new Date());
                            })()
                        }
                    },
                    {
                        type: "boolean",
                        name: "featured",
                        label: "Featured (Show on Homepage)",
                    },
                    {
                        type: "rich-text",
                        name: "body",
                        label: "Body",
                        isBody: true,
                    },
                ],
            },
        ],
    },
});
