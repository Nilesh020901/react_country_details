import { useState, useEffect, useTransition } from "react";
import { getCountryData } from "../api/postApi";
import { Loader } from "../components/UI/Loader";
import { SearchFilter } from "../components/UI/SearchFilter";
import { CountryCard } from "../components/Layout/CountryCard";

export const Country = () => {
    const [isPending, startTransition] = useTransition();
    const [countries, setCountries] = useState([]);

    const [search, setSearch] = useState();
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        startTransition( async() => {
            const res = await getCountryData();
            setCountries(res.data)
        })
    }, []);

    const searchCountry = (country) => {
        if (search) {
            return country.name.common.toLowerCase().includes(search.toLowerCase());
        }
        return country;
    }

    const filterRegion = (country) => {
        if (filter === "all") return country;
        return country.region === filter;
    }

    const filterCountries = countries.filter((country) => searchCountry(country) && filterRegion(country));

    if (isPending) return <Loader />
    return (
        <section className="country-section">
            <SearchFilter
                search={search}
                setSearch={setSearch}
                filter={filter}
                setFilter={setFilter}
                countries={countries}
                setCountries={setCountries}
            />
            <ul className="grid grid-four-cols">
                {filterCountries.map((curCountry, idx) => {
                    return <CountryCard country={curCountry} key={idx} />
                })}
            </ul>
        </section>
    )
};