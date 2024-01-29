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


export default function Nav() {
    return (
        <header>
            <nav>
                <ul className="flex items-center justify-between">
                    <li className="text-2xl font-bold mb-4">
                        Hi
                    </li>
                    <Drawer>
                        <DrawerTrigger className="text-2xl font-bold mb-4">Open</DrawerTrigger>
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