"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { ModeToggle } from "./ui/toggle-mode"


export default function Nav() {
    return (
        <header>
            <nav>
                <ul className="flex items-center justify-between">
                    <li>
                        <ModeToggle />
                    </li>
                    <li>
                    <Drawer>
                        <DrawerTrigger className="p-3 bg-green-500 text-white rounded">Open</DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                                <DrawerDescription>This action cannot be undone.</DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter>
                                {/* <Button>Submit</Button> */}
                                <DrawerClose>
                                    {/* <Button variant="outline">Cancel</Button> */}
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                    </li>
                    <li>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                    </li>

                </ul>
            </nav>
        </header>
    )
}