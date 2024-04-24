'use client'

import {Tabs, Tab} from "@nextui-org/react";
import ModifyTag from "./modifyTag";
import { useRouter } from "next/navigation";
import { ApplyTagsToRef } from "./applyTagsToRef";
import GroupCard from "./groupCard";

type Props = {
    tags: any;
    references: any;
}

const TagOptions = async (props: Props) => {
    const router = useRouter();

    return (
        <>
            <div className="center-content flex w-full flex-col dark:text-white">
                <Tabs aria-label="Tag Options" variant="solid">
                    <Tab key="modify" title="Modify Tags">
                        <ModifyTag tags={props.tags} router={router} references={props.references} />
                    </Tab>
                    <Tab key="apply" title="Apply Tags to References">
                        <ApplyTagsToRef tags={props.tags} references={props.references} />
                    </Tab>
                    <Tab key="group" title="View Tag Groups">
                        <div className="flex flex-wrap">
                            {props.tags.map((tag: any) => (
                                <span key={tag._id} className="me-5">
                                    <GroupCard tag={tag} /> 
                                </span>
                            ))}
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}

export default TagOptions;