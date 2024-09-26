type BuoyIconProps = {
    onClick?: () => void
}

const BuoyIcon = (props: BuoyIconProps) => {
    const {
        onClick,
    } = props
    return (
        <svg
            fill="#000000"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            xmlSpace="preserve"
            onClick={() => onClick && onClick()}
        >
            <g>
                <g>
                    <path d="M418.133,409.6h-10.402l-64.563-258.244c8.96-3.985,15.232-12.937,15.232-23.356v-17.067c0-14.114-11.486-25.6-25.6-25.6
                        h-68.267V67.055c14.677-3.814,25.6-17.067,25.6-32.922C290.133,15.309,274.825,0,256,0s-34.133,15.309-34.133,34.133
                        c0,15.855,10.923,29.107,25.6,32.922v18.278H179.2c-14.114,0-25.6,11.486-25.6,25.6V128c0,10.428,6.263,19.413,15.224,23.398
                        l-57.634,230.528c-1.143,4.574,1.638,9.207,6.204,10.351c0.7,0.179,1.391,0.256,2.082,0.256c3.823,0,7.296-2.586,8.269-6.46
                        l23.987-95.94h95.735V384c0,4.71,3.823,8.533,8.533,8.533s8.533-3.823,8.533-8.533v-93.867h95.735l32.521,130.074
                        c0.947,3.789,4.361,6.46,8.277,6.46h17.067c4.702,0,8.533,3.831,8.533,8.533c0,32.939-26.795,59.733-59.733,59.733H145.067
                        c-32.939,0-59.733-26.795-59.733-59.733c0-4.702,3.831-8.533,8.533-8.533h273.067c4.71,0,8.533-3.823,8.533-8.533
                        s-3.823-8.533-8.533-8.533H93.867c-14.114,0-25.6,11.486-25.6,25.6c0,42.342,34.458,76.8,76.8,76.8h221.867
                        c42.342,0,76.8-34.458,76.8-76.8C443.733,421.086,432.247,409.6,418.133,409.6z M238.933,34.133
                        c0-9.412,7.654-17.067,17.067-17.067s17.067,7.654,17.067,17.067c0,9.412-7.654,17.067-17.067,17.067
                        S238.933,43.546,238.933,34.133z M213.871,136.533c-4.719,0-8.542,3.823-8.542,8.533c0,4.71,3.823,8.533,8.542,8.533h33.596
                        v119.467h-91.469l31.479-125.926c0.64-2.551,0.06-5.257-1.553-7.322c-1.613-2.074-4.096-3.285-6.724-3.285
                        c-4.702,0-8.533-3.831-8.533-8.533v-17.067c0-4.702,3.831-8.533,8.533-8.533h153.6c4.702,0,8.533,3.831,8.533,8.533V128
                        c0,4.702-3.831,8.533-8.533,8.533H213.871z M264.533,273.067V153.6h61.602l29.867,119.467H264.533z"/>
                </g>
            </g>
        </svg>        
    )
}
export default BuoyIcon