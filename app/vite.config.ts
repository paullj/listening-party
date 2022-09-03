import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import unocss from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		unocss({
			shortcuts: [
				{
					button:
						"bg-gray-200 my-1 mx-1 px-2 py-1 rounded-lg hover:bg-gray-400 active:bg-gray-500 transition",
				},
				[
					/^button-(.*)$/,
					([, c]) =>
						`bg-${c}-200 my-1 mx-1 px-2 py-1 rounded hover:bg-${c}-400 transition`,
				],
			],
		}),
	],
});
