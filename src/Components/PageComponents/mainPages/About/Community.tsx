import React from "react";
import Container from "@/Components/Common/Container";

interface CommunityProps {
  community: any;
}

const Community = ({ community }: CommunityProps) => {
  return (
    <section className="">
      <Container>
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="font-medium text-black text-2xl sm:text-4xl xl:text-[38px]">
            {community?.data?.sectionTitle}
          </h2>
          <p className="font-normal text-black text-base sm:text-lg lg:text-[18px] mt-4 max-w-3xl mx-auto">
            {community?.data?.sectionSubTitle}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-9">
          {community?.data?.featureItems?.map((item: any) => (
            <div
              key={item?._id}
              className="rounded-[16px] bg-[rgba(230,243,255,0.20)] shadow-[0_0_6px_0_rgba(145,158,171,0.40)] py-8 lg:py-10 px-6 lg:px-10 text-center"
            >
              <h3 className="text-3xl lg:text-[38px] text-[#0085FF] font-semibold ">
                {item.title}
              </h3>
              <h4 className="text-[#404040] text-base lg:text-[20px] font-medium mt-2 capitalize">
                {item.subTitle}
              </h4>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Community;
