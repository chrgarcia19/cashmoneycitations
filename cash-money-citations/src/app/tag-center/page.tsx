import TagForm from "@/components/TagForm";

export default function TagCenter() {

    const tagData = {
        tagName: ""
    };

    return (
        <>
            <TagForm formID={"add-new-tag"} tagForm={tagData} />
        </>
    )
}