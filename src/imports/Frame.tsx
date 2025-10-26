function Text() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start justify-center min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Text">
      <p className="font-['Montserrat:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-black w-full">Audit Log</p>
    </div>
  );
}

function Content() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Content">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-center flex flex-wrap gap-[8px] items-center px-[4px] py-[8px] relative w-full">
          <Text />
        </div>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative rounded-[8px] shrink-0" data-name="Text">
      <div className="font-['Montserrat:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-black w-full">
        <p className="mb-0">June 6, 2025 10:45 am</p>
        <p>AI suggested response available for review.</p>
      </div>
    </div>
  );
}

function NataliCraig() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Natali Craig">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-center flex flex-wrap gap-[8px] items-center p-[8px] relative w-full">
          <Text1 />
        </div>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative rounded-[8px] shrink-0" data-name="Text">
      <div className="font-['Montserrat:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-black w-full">
        <p className="mb-0">June 6, 2025 10:45 am</p>
        <p>bjames@upenn.edu sent an email to srfs@upenn.edu.</p>
      </div>
    </div>
  );
}

function NataliCraig1() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Natali Craig">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-center flex flex-wrap gap-[8px] items-center p-[8px] relative w-full">
          <Text2 />
        </div>
      </div>
    </div>
  );
}

export default function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative size-full" data-name="Frame">
      <Content />
      <NataliCraig />
      <NataliCraig1 />
    </div>
  );
}