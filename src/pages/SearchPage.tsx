import { useState } from "react";
import usePlaceSearch from "../hooks/usePlaceSearch";
import { useGeolocation } from "../hooks/useGeolocation";
import SearchInput from "../components/SearchInput";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const location = useGeolocation();
  const safeLocation = location ?? undefined;
  const { results, loading } = usePlaceSearch(query, safeLocation);

  const handleSelect = (value: string) => {
    console.log("선택된 장소:", value);
    // TODO: 선택한 장소로 이동 등 로직 추가
  };

  return (
    <div>
      <SearchInput
        value={query}
        onChange={setQuery}
        suggestions={results}
        onSelect={handleSelect}
      />
      {loading && <p style={{ paddingLeft: 16 }}>검색 중...</p>}
    </div>
  );
};

export default SearchPage;
