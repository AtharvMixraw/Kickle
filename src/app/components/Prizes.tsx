import Image from "next/image";

const rewards = [
  {
    id: "mug",
    title: "Kickle Mug",
    points: 500,
    image: "/rewards/mug.png",
    description: "Reach 500 total points and unlock an official Kickle mug.",
  },
  {
    id: "tshirt",
    title: "Kickle T-Shirt",
    points: 800,
    image: "/rewards/tshirt.png",
    description: "Reach 800 total points and unlock an official Kickle t-shirt.",
  },
];

export default function Prizes() {
  return (
    <section id="prizes" className="py-24 border-t-2 border-surface-container-highest bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-l-4 border-primary pl-6">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter">Prizes</h2>
          <p className="text-on-background/60 max-w-sm font-medium text-sm mt-4 md:mt-0 uppercase tracking-wider">
            Earn points daily and claim official Kickle rewards.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-0 border-2 border-surface-container-highest">
          {rewards.map((reward, index) => (
            <article
              key={reward.id}
              className={`p-8 sm:p-10 bg-surface-container ${index === 0 ? "border-b-2 md:border-b-0 md:border-r-2" : ""} border-surface-container-highest`}
            >
              <div className="border-2 border-white bg-background p-4 mb-6">
                <div className="relative w-full aspect-[4/3] bg-surface-container-highest">
                  <Image
                    src={reward.image}
                    alt={reward.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 mb-4 border-2 border-primary bg-primary text-black px-3 py-1 text-xs font-extrabold uppercase tracking-wider">
                {reward.points} points milestone
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">{reward.title}</h3>
              <p className="text-sm text-on-background/70 uppercase leading-relaxed">{reward.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
