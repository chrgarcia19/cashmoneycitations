import {Card, CardHeader, CardBody} from "@nextui-org/react";


type Props = {
    tag: any;
}

const GroupCard = (props: Props) => {
    return (
        <>
            <Card>
                <CardHeader>
                    <h4>{props.tag.tagName}</h4>
                </CardHeader>
                <CardBody>

                </CardBody>
            </Card>
        </>
    );
}

export default GroupCard;