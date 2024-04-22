import {Card, CardHeader, CardBody, Divider, Chip} from "@nextui-org/react";
import TagForm from "../../components/tagComponents/TagForm";
import Link from "next/link";
import { handleDelete } from "@/app/tag-center/tagActions";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type Props = {
    tags: any;
    references: any;
    router: AppRouterInstance;
}

const ModifyTag = (props: Props) => {

    const tagData = {
        tagName: "",
        tagColor: "",
        referenceId: new Array<String>(),
    };

    return (
        <>
            <div className="flex justify-center items-center pt-5">
                <Card className="py-4 w-3/4">
                    <CardBody className="overflow-visible py-2">
                        <div className="flex flex-wrap justify-center items-center">
                            {props.tags?.map((tag: any, index: any) => (
                                <Chip key={index} 
                                        variant="flat"
                                        className="bg-teal-200 me-2 mb-2"
                                        onClose={() => handleDelete(tag._id, props.references, props.router)}>
                                            <Link href={{ pathname: `/${tag._id}/tags/edit`, query: { id: tag._id}}}>
                                            {tag.tagName}     
                                            </Link> 
                                </Chip>
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