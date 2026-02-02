'use client';

import { motion } from "framer-motion";
import React from "react";

interface DrawOnScrollIconProps {
    paths: string[];
    viewBox: string;
    className?: string;
    color?: string;
    fillAfterDraw?: boolean;
    strokeWidth?: number;
}

export const DrawOnScrollIcon = ({
    paths,
    viewBox,
    className,
    color = "currentColor",
    fillAfterDraw = false,
    strokeWidth = 2.5
}: DrawOnScrollIconProps) => {
    return (
        <div className={className}>
            <motion.svg
                viewBox={viewBox}
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-10%" }}
            >
                {paths.map((d, i) => (
                    <motion.path
                        key={i}
                        d={d}
                        fill={fillAfterDraw ? color : "none"}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={{
                            hidden: { pathLength: 0, fillOpacity: 0 },
                            visible: {
                                pathLength: 1,
                                fillOpacity: fillAfterDraw ? 1 : 0,
                                transition: {
                                    pathLength: { duration: 1, ease: "easeInOut" },
                                    fillOpacity: { delay: 1, duration: 0.5 }
                                }
                            }
                        }}
                    />
                ))}
            </motion.svg>
        </div>
    );
};
