import { authConfig } from "@/lib/auth";
import {Card, CardHeader, CardBody, Divider} from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { getUserTags } from "../componentActions/tagActions";
import TagForm from "./TagForm";
import Link from "next/link";

type Props = {
    tags: any;
}

const ModifyTag = (props: Props) => {

    const tagData = {
        tagName: "",
        tagColor: "",
        referenceID: new Array<String>(),
    };

    return (
        <>
            <div className="flex justify-center items-center pt-5">
                <Card className="py-4 w-3/4">
                    <CardBody className="overflow-visible py-2">
                        <div className="flex flex-wrap justify-center items-center">
                            {props.tags?.map((tag: any) => (
                                <Link href={{ pathname: `/${tag._id}/tags/edit`, query: { id: tag._id}}}>
                                    <div className={`badge badge-lg bg-teal-200 me-2 mb-2`}>
                                        {tag.tagName}           
                                    </div> 
                                </Link>
                            ))}
                        </div>
                    </CardBody>
                    <Divider orientation="horizontal" className="my-1"/>
                    <CardHeader className="flex pb-0 pt-2 flex-col items-center">
                        <h4 className="font-bold text-large">Create Tag</h4>
                        <TagForm formID={"add-new-tag"} tagForm={tagData} />
                    </CardHeader> 
                </Card>
            </div>
        </>
    )
}

export default ModifyTag;