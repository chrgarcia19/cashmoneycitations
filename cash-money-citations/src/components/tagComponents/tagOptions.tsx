'use client'

import {Tabs, Tab, Card, CardBody, CardHeader} from "@nextui-org/react";
import ModifyTag from "./modifyTag";
import { useRouter } from "next/navigation";

type Props = {
    tags: any;
}

const TagOptions = async (props: Props) => {
    const router = useRouter();

    return (
        <>
            <div className="center-content flex w-full flex-col">
                <Tabs aria-label="Tag Options" variant="solid">
                    <Tab key="modify" title="Modify Tags">
                        <ModifyTag tags={props.tags} router={router} />
                    </Tab>
                    <Tab key="apply" title="Apply Tags to References">
                        Apply Tags to References
                    </Tab>
                    <Tab key="group" title="View Tag Groups">
                        View Tag Groups
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}

export default TagOptions;