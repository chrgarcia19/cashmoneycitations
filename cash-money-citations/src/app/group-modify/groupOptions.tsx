'use client'

import AddReferenceToGroup from "../[id]/groups/edit/addRefToGroup";
import { CSLBibInterface } from "@/models/CSLBibTex";
import { Tab, Tabs } from "@nextui-org/react";

type Props = {
    references: CSLBibInterface[];
}

const GroupOptions = (props: Props) => {
   
    return (
        <>
            <div className="center-content flex w-full flex-col">
                <Tabs aria-label="Tag Options" variant="solid">
                    <Tab key="add" title="Add References to Group">
                        <AddReferenceToGroup references={props.references} formId={"add-references-to-group"} />
                    </Tab>
                    <Tab key="remove" title="Remove References from Group">

                    </Tab>
                </Tabs>
            </div>
           
        </>
    )
}

export default GroupOptions;