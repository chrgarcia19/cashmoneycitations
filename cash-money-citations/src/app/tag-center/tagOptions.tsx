'use client'

import {Tabs, Tab} from "@nextui-org/react";
import ModifyTag from "./modifyTag";
import { useRouter } from "next/navigation";
import { ApplyTagsToRef } from "../../components/tagComponents/applyTagsToRef";
import TagLibrary from "./tagLibrary";

type Props = {
    allTags: any;
    tags: any;
    references: any;
}

const TagOptions = async (props: Props) => {
    const router = useRouter();

    return (
        <>
            <div className="center-content flex w-full flex-col">
                <Tabs aria-label="Tag Options" variant="solid">
                    <Tab key="modify" title="Modify Tags">
                        <ModifyTag tags={props.tags} router={router} references={props.references} />
                    </Tab>
                    <Tab key="library" title="Tag Library">
                        {/*<ApplyTagsToRef tags={props.tags} references={props.references} />*/}
                        <TagLibrary tags={props.allTags} />
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}

export default TagOptions;