import Image from "next/image"
import Link from "next/link"

const Footer = () => {
    return (
        <div className="py-24 md:py-8 px-4 bg-gray-100">
            {/* TOP */}
            <div className="flex justify-between gap-24">
                {/* LEFT */}
                <div className="flex flex-col gap-8">
                    <Link href="/">
                        <div className="text-2xl tracking-wide">24uzr</div>
                    </Link>
                    <p>24 hour sailing race planner</p>
                    <span className="font-semibold">info@24uzr.nl</span>
                    <div className="flex gap-6">
                        <Image src="/facebook.png" alt="" width={16} height={16} />
                        <Image src="/instagram.png" alt="" width={16} height={16} />
                        <Image src="/youtube.png" alt="" width={16} height={16} />
                        <Image src="/x.png" alt="" width={16} height={16} />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Footer