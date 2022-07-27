export const TrackerList = (props) => {
  const { pictures } = props;

  if (pictures) {
    return (
      <div>
        <div className="px-4" style={{ maxWidth: "1600px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {pictures.map((pic, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <div className="p-3 cursor-pointer hover:bg-sky-100">
                  <img src={pic.picUrl} className="rounded-xl" />
                  <h2 className="justify-center text-gray-500 pt-2">
                    {pic.date.toString()}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};
