import { useNavigate } from "react-router-dom";
import type { CinemaItem } from "../types";
import { useState, useMemo } from "react";
import { AutoComplete, ConfigProvider } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";

interface CinemaSearchBarProps {
    cinemas: CinemaItem[];
}

export function CinemaSearchBar({ cinemas }: CinemaSearchBarProps) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);

    const options = useMemo(() => {
        return cinemas
            .filter(cinema =>
                cinema.cinemaName
                    ?.toLowerCase()
                    .includes(query.toLowerCase())
            )
            .map(cinema => ({
                value: cinema.cinemaName,
                label: cinema.cinemaName,
                id: cinema.cinema_Id
            }));
    }, [cinemas, query]);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorBgElevated: '#1e1e24', 
                    colorText: '#ffffff',
                },
                components: {
                    Select: {
                        colorBgContainer: '#1e1e24',
                        colorBorder: 'rgba(212, 175, 55, 0.3)',
                        colorText: '#ffffff',
                        colorTextPlaceholder: '#64748b',
                        colorPrimary: '#d4af37',
                        colorPrimaryHover: '#d4af37',
                        controlItemBgHover: 'rgba(212, 175, 55, 0.15)',
                        optionSelectedBg: 'rgba(212, 175, 55, 0.25)',   
                        optionSelectedColor: '#d4af37',                 
                        
                        // Hacemos que el ícono sea dorado al pasar el mouse
                        colorIcon: '#64748b',
                        colorIconHover: '#d4af37',
                    }
                }
            }}
        >
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mx-auto mt-6">
                <AutoComplete
                    size="large"
                    className="flex-1 w-full [&_.ant-select-clear]:bg-[#dddde9]! [&_.ant-select-clear]:flex! [&_.ant-select-clear]:items-center! [&_.ant-select-clear]:justify-center! [&_.ant-select-clear]:w-6! [&_.ant-select-clear]:h-6! [&_.ant-select-clear]:-mt-3!"
                    placeholder="Search for a cinema..."
                    value={query}
                    options={options}
                    allowClear={{ clearIcon: <CloseOutlined style={{ fontSize: '16px' }} /> }} 
                    onSearch={(value) => setQuery(value)}
                    onChange={(value) => {
                        setQuery(value || "");
                        if (!value) setSelectedCinemaId(null);
                    }}
                    onSelect={(value, option: any) => {
                        setQuery(value);
                        setSelectedCinemaId(option.id);
                    }}
                    filterOption={false}
                />

                <button
                    type="button"
                    disabled={!selectedCinemaId}
                    onClick={() => navigate(`/cinema/${selectedCinemaId}`)}
                    className="h-12 px-8 cursor-pointer flex items-center justify-center gap-2 rounded-xl text-black bg-[#d4af37] hover:bg-[#e6c24a] transition-all duration-300 font-bold uppercase tracking-wider text-sm shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.45)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
                >
                    <SearchOutlined /> Select Cinema
                </button>
            </div>
        </ConfigProvider>
    );
}