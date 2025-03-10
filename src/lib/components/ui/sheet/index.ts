import { Dialog as SheetPrimitive } from "bits-ui";
import { type VariantProps, tv } from "tailwind-variants";

import Portal from "./sheet-portal.svelte";
import Overlay from "./sheet-overlay.svelte";
import Content from "./sheet-content.svelte";
import Header from "./sheet-header.svelte";
import Footer from "./sheet-footer.svelte";
import Title from "./sheet-title.svelte";
import Description from "./sheet-description.svelte";

const Root = SheetPrimitive.Root;
const Close = SheetPrimitive.Close;
const Trigger = SheetPrimitive.Trigger;

export {
	Root,
	Close,
	Trigger,
	Portal,
	Overlay,
	Content,
	Header,
	Footer,
	Title,
	Description,
	//
	Root as Sheet,
	Close as SheetClose,
	Trigger as SheetTrigger,
	Portal as SheetPortal,
	Overlay as SheetOverlay,
	Content as SheetContent,
	Header as SheetHeader,
	Footer as SheetFooter,
	Title as SheetTitle,
	Description as SheetDescription,
};

export const sheetVariants = tv({
	base: "bg-background fixed z-50 gap-4 p-6 shadow-lg",
	variants: {
		side: {
			top: "inset-x-0 top-0 border-b",
			bottom: "inset-x-0 bottom-0 border-t",
			left: "inset-y-0 left-0 h-full border-r",
			right: "inset-y-0 right-0 h-full border-l ",
			rightLarge: "inset-y-0 right-0 h-full w-1/2 border-l",
		},
		size: {
			normal: "w-3/4 sm:max-w-sm",
			large: "w-1/2"
		}
	},

	defaultVariants: {
		side: "right",
		size: "normal"
	},
});

export const sheetTransitions = {
	top: {
		in: {
			y: "-100%",
			duration: 500,
			opacity: 1,
		},
		out: {
			y: "-100%",
			duration: 300,
			opacity: 1,
		},
	},
	bottom: {
		in: {
			y: "100%",
			duration: 500,
			opacity: 1,
		},
		out: {
			y: "100%",
			duration: 300,
			opacity: 1,
		},
	},
	left: {
		in: {
			x: "-100%",
			duration: 500,
			opacity: 1,
		},
		out: {
			x: "-100%",
			duration: 300,
			opacity: 1,
		},
	},
	right: {
		in: {
			x: "100%",
			duration: 500,
			opacity: 1,
		},
		out: {
			x: "100%",
			duration: 300,
			opacity: 1,
		},
	},
};

export type Side = VariantProps<typeof sheetVariants>["side"];
export type Size = VariantProps<typeof sheetVariants>["size"];