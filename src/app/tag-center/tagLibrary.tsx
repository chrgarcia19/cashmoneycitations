'use client'

import { LogCMCError } from "@/components/componentActions/logActions";
import { getUserTags, handleNewTag } from "@/components/componentActions/tagActions";
import { Tag } from "@/models/Tag"
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Tooltip } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineAddTask } from "react-icons/md";

type Props = {
    tags: Tag[];
}

const TagLibrary = (props: Props) => {

    const router = useRouter();
    const { data: session } = useSession();

    const [userOwnedTags, setUserOwnedTags] = useState<Tag[]>([]);

    useEffect(() => {
        getSpecificUser();
    }, []);

    async function getSpecificUser(){
        const userId = session?.user?.id;
        if (userId){
            const userOwnedTagsData = await getUserTags(userId);
            setUserOwnedTags(userOwnedTagsData ?? []);
        } else {
            setUserOwnedTags([]);
        }
    };

    const handleSubmit = async (tag: Tag) => {
        try {
            const tagWithoutId = {...tag, _id: undefined };
            handleNewTag(tagWithoutId, session?.user?.id);
            router.push("/tag-center");
            router.refresh();
        } catch (error: any) {
            LogCMCError("WARNING", 'TAG', error);
            console.log(JSON.stringify(error));
        }
    }

    return (
        <>
            <div className="flex items-center justify-center flex-wrap gap-4">
                {props.tags.map((tag: Tag) => {
                    const isUserOwned = userOwnedTags.some((t: Tag) => t._id == tag._id);
                    return (
                        <Card className="flex items-center justify-center" key={tag._id}>
                            <CardHeader className="flex items-center justify-center">
                                    <div className="join join-vertical">
                                        <h4 className="flex items-center justify-center font-bold underline pb-1">Tag</h4>
                                        <Chip key={tag._id} 
                                            variant="flat"
                                            className="bg-teal-200 me-2 mb-2 dark:text-black">
                                                {tag.tagName}     
                                        </Chip>
                                    </div>                      
                            </CardHeader>
                            <Divider />
                            <CardBody className="flex items-center justify-center">
                                <p className="font-bold text-small capitalize">Your Tag? - {isUserOwned ? "Yes" : "No"}</p>
                            </CardBody>
                            <Divider />
                            <CardFooter className="flex items-center justify-center flex-col">
                                    <Tooltip content="Add Tag to List" className="dark:text-white">
                                        <Button
                                            color="success"
                                            size="md"
                                            className="cursor-pointer active:opacity-50"
                                            onClick={async() => handleSubmit(tag)}
                                            >
                                                <MdOutlineAddTask />
                                        </Button>
                                    </Tooltip>
                            </CardFooter>
                        </Card>
                    );
                })}
                
            </div>
        </>
    )

}

export default TagLibrary;