import { useEffect, useState } from "react";
import { Spin, Typography, Carousel, ConfigProvider } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import type { MovieItem, CinemaItem, FetchState } from "../types";
import { getCinemas } from "../api/Cinema";
import { CinemaSearchBar } from "../Components/CinemaSearchBar";
import { GetMovies } from "../api/Movies";
import { MovieCard } from "../Components/MovieCard";

const { Title, Paragraph } = Typography;

export function SelectCinema() {
    const [items, setItems] = useState<CinemaItem[]>([]);
    const [fState, setFState] = useState<FetchState>("idle");

    const [movies, setMovies] = useState<MovieItem[]>([]);
    const [movieState, setMovieState] = useState<FetchState>("idle");

    const moviesPerSlide: number = 4;
    const moviesGroup = [];

    useEffect(() => {
        let active = true;
        setFState("loading");
        getCinemas()
            .then((data) => {
                if (!active) return;
                setItems(data);
                setFState("loaded");
            })
            .catch(() => {
                if (active) setFState("failed");
            });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        let active = true;
        setMovieState("loading");
        GetMovies()
            .then((data) => {
                if (!active) return;
                setMovies(data);
                setMovieState("loaded");
            })
            .catch(() => {
                if (active) setMovieState("failed");
            });
        return () => { active = false; };
    }, []);

    for (let i = 0; i < movies.length; i += moviesPerSlide){
        moviesGroup.push(movies.slice(i, i + moviesPerSlide));
    }

    const displayMovies = movies.length > 0 && movies.length < 8 
        ? [...movies, ...movies, ...movies]
        : movies;

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    colorPrimary: '#d4af37',
                    colorBgElevated: '#1e1e24',
                    colorText: '#ffffff',
                    colorTextDescription: '#94a3b8',
                    colorTextPlaceholder: '#64748b',
                    borderRadiusLG: 12,
                },
                components: {
                    Input: {
                        colorBgContainer: '#1e1e24',
                        colorBorder: 'rgba(212, 175, 55, 0.3)',
                        colorText: '#ffffff',
                        controlHeightLG: 48,
                        activeBorderColor: '#d4af37',
                        hoverBorderColor: '#d4af37',
                    }
                }
            }}
        >
            <div className="min-h-screen flex flex-col items-center pt-16 pb-12 px-4 md:px-8">
                
                {/* HERO SECTION */}
                <div className="w-full max-w-4xl flex flex-col items-center text-center mt-10 mb-20">
                    <div className="w-20 h-20 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center mb-6 border border-[rgba(212,175,55,0.2)] shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                        <EnvironmentOutlined className="text-4xl text-[#d4af37]" />
                    </div>
                    
                    <Title level={1} className="text-white! m-0! text-4xl! md:text-5xl! lg:text-6xl! tracking-widest font-black uppercase mb-4 drop-shadow-lg" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                        Fantasy World Cinema
                    </Title>
                    
                    <Paragraph className="text-[#94a3b8]! text-lg! max-w-xl mx-auto">
                        Step into the magic. Select your nearest cinema to explore showtimes, reserve your seats, and enjoy the show.
                    </Paragraph>

                    <div className="w-full mt-4">
                        {fState === "loading" && <Spin size="large" className="mt-8" />}
                        {fState === "failed" && <Paragraph className="text-red-500! mt-8">Error loading cinemas.</Paragraph>}
                        {fState === "loaded" && <CinemaSearchBar cinemas={items} />}
                    </div>
                </div>

                {/* MOVIES SECTION */}
                <div className="w-full max-w-350 mx-auto mt-12 overflow-hidden">
                    <div className="flex justify-between items-center mb-8 px-4 border-b border-[rgba(212,175,55,0.2)] pb-4">
                        <Title level={3} className="text-[#d4af37]! m-0! uppercase tracking-widest">
                            Now Showing
                        </Title>
                        <span className="text-[#64748b] text-sm font-medium tracking-widest uppercase hidden sm:block">
                            Drag to explore &rarr;
                        </span>
                    </div>
                    
                    {movieState === "loading" ? (
                        <div className="flex justify-center py-20"><Spin size="large" /></div>
                    ) : (
                        <div className="px-2">
                            <Carousel 
                                dots={false}             
                                arrows={false}           
                                infinite={true}          
                                draggable={true}         
                                swipeToSlide={true}
                                speed={400}                  
                                touchThreshold={100}         
                                waitForAnimate={false}      
                                slidesToShow={4}         
                                className="pb-4"
                                responsive={[
                                    { breakpoint: 1280, settings: { slidesToShow: 3 } },
                                    { breakpoint: 1024, settings: { slidesToShow: 2.5 } },
                                    { breakpoint: 768, settings: { slidesToShow: 1.5 } },
                                    { breakpoint: 480, settings: { slidesToShow: 1.15, centerMode: true, centerPadding: '10px' } }
                                ]}
                            >
                                {displayMovies.map((movie, index) => (
                                    <div key={`${movie.movie_Id}-${index}`} className="px-3 sm:px-4 py-6"> 
                                        <MovieCard movie={movie} />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    )}
                </div>
            </div>
        </ConfigProvider>
    );
}