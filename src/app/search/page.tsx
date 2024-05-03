import SearchField from "./SearchField";
import searchRefs from "./searchRefs";

export default async function search() {

  return (
    <main className="m-12 text-center">
     <SearchField searchRefs={searchRefs}/>    
    </main>
  );
}